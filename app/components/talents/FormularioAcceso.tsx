"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { crearCliente } from "../../lib/supabase/cliente";

type Tipo = "creador" | "marca";
type Modo = "entrar" | "registro";

/**
 * Acceso a la intranet, para creadores y para marcas.
 *
 * El tipo elegido viaja en user_metadata, pero SOLO para saber que alta
 * ensenar despues: no decide permisos. Ese campo lo puede editar el propio
 * usuario, asi que quien es quien se deduce de en que tabla tiene fila, y eso
 * lo protege RLS.
 */
export default function FormularioAcceso() {
  const router = useRouter();
  const params = useSearchParams();
  const volver = params.get("volver");

  /* Si la vuelta de Google trae un error, se enseña aquí en vez de dejarle
     en la pantalla de acceso sin explicación de por qué no ha entrado. */
  const errorDeVuelta = params.get("error");

  const [tipo, setTipo] = useState<Tipo>("creador");
  const [modo, setModo] = useState<Modo>("registro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(errorDeVuelta);
  const [aviso, setAviso] = useState<string | null>(null);

  const destino = volver ?? (tipo === "creador" ? "/talents/panel" : "/talents/marca");

  async function entrarConGoogle() {
    setEnviando(true);
    setError(null);

    /* El tipo y el destino viajan en la URL de vuelta porque durante el rodeo
       por Google se pierde todo el estado de esta pantalla. */
    const vuelta = new URL("/talents/auth/callback", window.location.origin);
    vuelta.searchParams.set("tipo", tipo);
    if (volver) vuelta.searchParams.set("volver", volver);

    const { error } = await crearCliente().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: vuelta.toString(),
        /* Fuerza la pantalla de elección de cuenta. Sin esto, quien tenga
           varias sesiones de Google abiertas entra con la primera sin poder
           elegir, y acaba con la ficha en la cuenta equivocada. */
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setError(traducir(error.message));
      setEnviando(false);
    }
    /* Si va bien no se quita el «enviando»: el navegador ya se está yendo a
       Google y dejar el botón activo invita a pulsarlo dos veces. */
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    setAviso(null);

    const supabase = crearCliente();

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(traducir(error.message));
        setEnviando(false);
        return;
      }
      /* refresh() ademas de push(): el layout del panel se pinta en el
         servidor y sin esto seguiria viendo la sesion anterior. */
      router.push(destino);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { tipo },
        emailRedirectTo: `${window.location.origin}/talents/acceso`,
      },
    });

    if (error) {
      setError(traducir(error.message));
      setEnviando(false);
      return;
    }

    /* Sin sesion justo despues de registrarse significa que Supabase pide
       confirmar el correo. No es un fallo, pero hay que decirlo: si no, el
       usuario se queda mirando una pantalla que no avanza. */
    if (!data.session) {
      setAviso(
        "Te hemos enviado un correo para confirmar tu cuenta. Ábrelo y vuelve aquí para entrar.",
      );
      setEnviando(false);
      return;
    }

    router.push(destino);
    router.refresh();
  }

  return (
    <form className="form" onSubmit={enviar}>
      <div className="section-cta section-cta--wrap" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
        <button
          type="button"
          className={`btn ${tipo === "creador" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTipo("creador")}
          aria-pressed={tipo === "creador"}
        >
          Soy creador
        </button>
        <button
          type="button"
          className={`btn ${tipo === "marca" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTipo("marca")}
          aria-pressed={tipo === "marca"}
        >
          Soy una marca
        </button>
      </div>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={entrarConGoogle}
        disabled={enviando}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
      >
        <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
          <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
        </svg>
        Continuar con Google
      </button>

      <p className="form-note" style={{ textAlign: "center" }}>
        o con tu correo
      </p>

      <label>
        Correo electrónico
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete={modo === "entrar" ? "current-password" : "new-password"}
        />
        <span className="form-note">Mínimo 8 caracteres.</span>
      </label>

      {error ? <p className="form-error">{error}</p> : null}
      {aviso ? <p className="form-status">{aviso}</p> : null}

      <div className="hero-actions">
        <button className="btn btn-primary" type="submit" disabled={enviando}>
          {enviando ? "Un momento…" : modo === "entrar" ? "Entrar" : "Crear cuenta"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setModo(modo === "entrar" ? "registro" : "entrar");
            setError(null);
            setAviso(null);
          }}
        >
          {modo === "entrar" ? "No tengo cuenta" : "Ya tengo cuenta"}
        </button>
      </div>
    </form>
  );
}

/** Los mensajes de Supabase llegan en inglés y de cara al usuario no valen. */
function traducir(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials")) return "El correo o la contraseña no son correctos.";
  if (m.includes("email not confirmed")) return "Todavía no has confirmado tu correo. Mira tu bandeja de entrada.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ya hay una cuenta con ese correo. Entra en vez de registrarte.";
  if (m.includes("password should be")) return "La contraseña es demasiado corta.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos seguidos. Espera un minuto y vuelve a probar.";
  return mensaje;
}
