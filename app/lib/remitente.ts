import { EMAIL_ADMIN, EMAIL_PROJECTS } from "../site-data";

/**
 * De dónde sale el correo que manda la web y a quién puede llegar.
 *
 * Vive aparte porque lo usan dos sitios —el formulario de contacto y el informe
 * semanal— y si cada uno llevara su propia copia, el día que el dominio
 * verifique habría que acordarse de tocar los dos. Se tocaría uno.
 *
 * Mientras `maenstudios.com` no esté verificado en Resend hay dos límites que
 * no dependen de nosotros: no se puede enviar desde una dirección del dominio,
 * y no se puede enviar a nadie que no sea la dirección dueña de la cuenta, que
 * es info@. Así que se sale de onboarding@resend.dev y solo llega a ese buzón.
 *
 * No es lo que queremos —los mensajes deberían llegar también a jandro@—, pero
 * es muchísimo mejor que lo que había: hasta ahora el visitante rellenaba el
 * formulario, veía una disculpa y el mensaje no lo recibía nadie.
 *
 * Definir CONTACT_FROM_EMAIL es la señal de que el dominio ya verifica: a
 * partir de ese momento el correo sale del dominio propio y llega a los dos
 * buzones, sin tocar código. El informe semanal avisa de esto cada viernes
 * mientras siga pendiente.
 */
export const DOMINIO_VERIFICADO = Boolean(process.env.CONTACT_FROM_EMAIL);

export const REMITENTE = DOMINIO_VERIFICADO
  ? (process.env.CONTACT_FROM_EMAIL as string)
  : "onboarding@resend.dev";

export const BUZONES = DOMINIO_VERIFICADO
  ? [EMAIL_ADMIN, EMAIL_PROJECTS]
  : [EMAIL_ADMIN];
