import type { ProjectLocale } from './upcoming-projects';
export const launchCopy = {
  it: {title:'Ti avvisiamo quando è pronta.',intro:'Lascia la tua email per ricevere l’avviso di lancio di',email:'La tua email',button:'Avvisami al lancio',consent:'Acconsento a ricevere solo l’avviso di lancio di questa app.',note:'Nessun pagamento. Puoi chiedere la cancellazione quando vuoi.',cancel:'Richiedi cancellazione',busy:'Iscrizione in corso…',success:'Iscrizione registrata. Ti avviseremo al lancio di questa app.',error:'Iscrizione non completata. Riprova o contattaci via email.',fallback:'Se il modulo non funziona, scrivi a',state:'In sviluppo'},
  en: {title:'Be the first to know when it’s ready.',intro:'Leave your email to receive the launch notice for',email:'Your email',button:'Notify me at launch',consent:'I agree to receive only this app’s launch notice.',note:'No payment. You can request deletion at any time.',cancel:'Request deletion',busy:'Joining…',success:'You’re on the list. We’ll notify you when this app launches.',error:'Could not join. Please try again or email us.',fallback:'If the form does not work, email',state:'In development'},
  fr: {title:'Soyez informé de son lancement.',intro:'Laissez votre email pour recevoir l’avis de lancement de',email:'Votre email',button:'Me prévenir au lancement',consent:'J’accepte de recevoir uniquement l’avis de lancement de cette application.',note:'Aucun paiement. Vous pouvez demander la suppression à tout moment.',cancel:'Demander la suppression',busy:'Inscription…',success:'Inscription enregistrée. Nous vous informerons du lancement de cette application.',error:'Inscription impossible. Réessayez ou contactez-nous par email.',fallback:'Si le formulaire ne fonctionne pas, écrivez à',state:'En développement'},
  es: {title:'Te avisamos cuando esté lista.',intro:'Deja tu email para recibir el aviso de lanzamiento de',email:'Tu email',button:'Avísame al lanzamiento',consent:'Acepto recibir únicamente el aviso de lanzamiento de esta aplicación.',note:'Sin pagos. Puedes solicitar la eliminación cuando quieras.',cancel:'Solicitar eliminación',busy:'Registrando…',success:'Registro completado. Te avisaremos del lanzamiento de esta aplicación.',error:'No se pudo completar el registro. Reinténtalo o escríbenos.',fallback:'Si el formulario no funciona, escribe a',state:'En desarrollo'},
  de: {title:'Wir informieren dich zum Start.',intro:'Hinterlasse deine E-Mail für die Startbenachrichtigung zu',email:'Deine E-Mail',button:'Zum Start benachrichtigen',consent:'Ich möchte nur die Startbenachrichtigung für diese App erhalten.',note:'Keine Zahlung. Du kannst jederzeit die Löschung anfordern.',cancel:'Löschung anfordern',busy:'Wird eingetragen…',success:'Anmeldung gespeichert. Wir informieren dich, wenn diese App startet.',error:'Anmeldung fehlgeschlagen. Bitte erneut versuchen oder eine E-Mail senden.',fallback:'Falls das Formular nicht funktioniert, schreibe an',state:'In Entwicklung'},
};
export default function LaunchSignup({project, locale}:{project:'citybeam'|'velvet-table';locale:ProjectLocale}) {
  const t=launchCopy[locale], name=project==='citybeam'?'CityBeam':'Velvet Table';
  return <section className={`launch-signup ${project}`} id="avvisami" aria-labelledby="launch-title">
    <div><span className="launch-state">{name} · {t.state}</span><h2 id="launch-title">{t.title}</h2><p>{t.intro} {name}.</p></div>
    <form data-launch-signup data-busy={t.busy} data-success={t.success} data-error={t.error} action="/api/launch-waitlist" method="post">
      <input type="hidden" name="project" value={project}/><input type="hidden" name="locale" value={locale}/>
      <label className="launch-email">{t.email}<input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="nome@email.it"/></label>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="launch-consent"><input name="consent" type="checkbox" required/><span>{t.consent} <a href={locale==='it'?'/privacy':'/en/privacy'}>Privacy</a></span></label>
      <button type="submit">{t.button}</button><p className="launch-result" role="status" aria-live="polite"/>
      <p className="launch-note">{t.note} <a href={`mailto:andrea@kreluna.it?subject=${encodeURIComponent(`Unsubscribe ${name}`)}`}>{t.cancel}</a>.</p>
      <noscript><p>{t.fallback} <a href="mailto:andrea@kreluna.it">andrea@kreluna.it</a>.</p></noscript>
    </form><script src="/assets/launch-signup.js" defer/>
  </section>;
}
