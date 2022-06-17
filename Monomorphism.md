In Category Theory a *monomorphism* is a morphism $f:X\to Y$ for which
the following condition holds: For any two morphisms 
$g_1, g_2: Z\to X$
the identity $f\circ g_1 = g\circ g_2$ induces $g_1 = g_2$.

**Monomorphisms are the categorial way to describe an injective
function.** It is a bit more general, but for functions on sets, an
injective function is always a monomorphism.

Let $f:X\to Y$ be an injective function for the sets $X$ and $Y$. This
in particular means that there is a function $h:f(X)\to X$ such that
$h(f(x)) = x$ for all $x\in X$.

Now lets have another set, $Z$, and two functions $g_1, g_2: Z\to X$
such that $f\circ g_1 = f\circ g_2$ which means in particular that
$$f(g_1(z)) = f(g_2(z))$$ for all $z\in Z$. Therefore we get

\begin{align*}
    g_1(z) &= h(f(g_1(z)))\\
    &= h(f(g_2(z))) \\
    &= g_2(z)\;.
\end{align*}

This means that $g_1=g_2$, and hence that $f$ is a monomorphism.

# To Note
The categorial way to define a monomorphism cannot talk about the
elements of the category's objects, because it has none, but it
nevertheless manages to define a surjective function.

