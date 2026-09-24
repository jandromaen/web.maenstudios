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

  const [tipo, setTipo] = useState<Tipo>("creador");
  const [modo, setModo] = useState<Modo>("registro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const destino = volver ?? (tipo === "creador" ? "/talents/panel" : "/talents/marca");

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
