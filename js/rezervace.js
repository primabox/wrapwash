const form = document.getElementById('rezervace-form');
const msg  = document.getElementById('form-message');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic client-side validation
        const name    = form.querySelector('[name="name"]').value.trim();
        const phone   = form.querySelector('[name="phone"]').value.trim();
        const email   = form.querySelector('[name="email"]').value.trim();
        const consent = form.querySelector('[name="consent"]').checked;

        if (!name || !phone || !email) {
            showMessage('Vyplňte prosím jméno, telefon a e-mail.', false);
            return;
        }
        if (!consent) {
            showMessage('Musíte souhlasit se zpracováním osobních údajů.', false);
            return;
        }

        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';

        try {
            const data = new FormData(form);
            const res  = await fetch('send.php', { method: 'POST', body: data });
            const json = await res.json();

            showMessage(json.message, json.success);
            if (json.success) form.reset();
        } catch {
            showMessage('Chyba spojení. Zkuste to prosím znovu.', false);
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
        }
    });
}

function showMessage(text, success) {
    msg.textContent = text;
    msg.className = [
        'mt-5 p-3 rounded font-futura text-sm text-center',
        success ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
    ].join(' ');
}
