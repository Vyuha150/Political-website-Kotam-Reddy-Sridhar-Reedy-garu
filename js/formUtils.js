// js/formUtils.js
// Shared helpers reused across every form's submit handler, instead of
// each form re-implementing its own submit-guard logic.

/**
 * Disables a form's submit button and swaps its label while `handler` runs,
 * so a slow network request can't be triggered twice by an impatient click.
 * Restores the original label and re-enables the button afterwards, whether
 * `handler` succeeds or throws.
 */
export async function guardSubmit(form, handler) {
  const submitBtn = form.querySelector('[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.textContent : null;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
  }

  try {
    await handler();
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  }
}
