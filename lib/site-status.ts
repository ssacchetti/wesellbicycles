// Site-wide pause switch. While true, the site stays online and indexable
// but stops taking bikes: the hero becomes a "Back soon." notice, the nav
// carries a status strip, the sell form is blurred and locked, and every
// WhatsApp link is removed. Flip to false (and redeploy) to reopen intake.
export const PAUSED = false;
