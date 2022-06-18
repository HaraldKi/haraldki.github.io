"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Templater {
    constructor(scriptEl) {
        var _a;
        if (!(scriptEl instanceof HTMLScriptElement)) {
            this.searchParams = new URLSearchParams('');
            return;
        }
        const searchParams = (_a = scriptEl.getAttribute('src')) === null || _a === void 0 ? void 0 : _a.split('?', 2)[1];
        if (searchParams === undefined) {
            this.searchParams = new URLSearchParams('');
            return;
        }
        this.searchParams = new URLSearchParams(searchParams);
    }
    startup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wrapTemplates(document.body, new Set());
            const src = this.searchParams.get('head');
            if (src !== null) {
                yield this.loadHead(src);
            }
        });
    }
    pageToc(container) {
        const pageTocElements = container.querySelectorAll('.pagetoc:not([tocdone])');
        console.log('have toc elements: ' + pageTocElements.length);
        if (pageTocElements.length === 0) {
            return;
        }
        const hElements = document.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]');
        pageTocElements.forEach((toc) => {
            hElements.forEach((el) => this.addTocEntryFor(toc, el));
            toc.setAttribute('tocdone', '');
        });
    }
    addTocEntryFor(toc, hxElement) {
        if (!(hxElement instanceof HTMLElement)) {
            return;
        }
        console.log('adding to for ' + hxElement.id);
        const div = document.createElement('div');
        const level = hxElement.tagName.substring(1);
        div.classList.add('toclevel' + level);
        const ahref = document.createElement('a');
        div.append(ahref);
        ahref.href = '#' + hxElement.id;
        ahref.innerText = hxElement.innerText;
        toc.append(div);
    }
    replaceVars(element, vars) {
        element.querySelectorAll('getvar').forEach((getvar) => {
            const varname = getvar.getAttribute('var');
            if (varname === null) {
                return;
            }
            const replacement = vars.get(varname);
            if (replacement === undefined) {
                return;
            }
            if (replacement instanceof HTMLElement) {
                getvar.replaceWith(replacement.cloneNode(true));
                return;
            }
            const nodes = [];
            for (const node of replacement) {
                nodes.push(node.cloneNode(true));
            }
            getvar.replaceWith(...nodes);
        });
    }
    loadHtml(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = yield fetch(src).then((resp) => resp.text());
            const result = document.createElement('div');
            console.log('loaded html %o', text.substring(0, 100));
            result.innerHTML = text;
            return result;
        });
    }
    wrapTemplates(container, expanding) {
        return __awaiter(this, void 0, void 0, function* () {
            let wrap = null;
            while (null !== (wrap = container.querySelector('wrap'))) {
                const srcFile = wrap.getAttribute('src');
                const x = wrap.getAttribute('x');
                console.log('....... got %o of %o', srcFile, x);
                if (srcFile === null || expanding.has(srcFile)) {
                    console.log('ignoring ' + srcFile);
                    wrap.replaceWith(...wrap.childNodes);
                    continue;
                }
                if (!wrap.hasAttribute('allow-recursion')) {
                    expanding.add(srcFile);
                }
                const vars = new Map();
                vars.set('content', wrap.childNodes);
                const template = yield this.loadHtml(srcFile);
                this.replaceVars(template, vars);
                yield this.wrapTemplates(template, expanding);
                this.pageToc(template);
                const contentQuery = wrap.getAttribute('content');
                if (contentQuery !== null) {
                    const contentElems = this.querySelectorTopMatches(template, contentQuery);
                    wrap.replaceWith(...contentElems);
                }
                else {
                    wrap.replaceWith(...template.childNodes);
                }
            }
        });
    }
    querySelectorTopMatches(elem, query) {
        let match = null;
        const result = [];
        while (null !== (match = elem.querySelector(query))) {
            match.remove();
            result.push(match);
        }
        return result;
    }
    loadHead(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const div = yield this.loadHtml(src);
            document.head.append(...div.childNodes);
            document.head.querySelectorAll('script').forEach((scriptEl) => {
                const newScriptEl = document.createElement('script');
                scriptEl.getAttributeNames().forEach((name) => {
                    newScriptEl[name] = scriptEl.getAttribute(name);
                });
                newScriptEl.innerHTML = scriptEl.innerHTML;
                scriptEl.replaceWith(newScriptEl);
            });
        });
    }
}
const templater = new Templater(document.currentScript);
document.addEventListener('DOMContentLoaded', () => templater.startup(), {
    once: true,
});
//# sourceMappingURL=templater.js.map