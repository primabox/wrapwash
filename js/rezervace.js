const form = document.getElementById('rezervace-form');
const msg  = document.getElementById('form-message');

// Validation rules
const NAME_REGEX  = /^[A-Za-záčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][A-Za-záčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s\-\.]{1,79}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{9,20}$/;

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = form.querySelector('[name="name"]').value.trim();
        const phone   = form.querySelector('[name="phone"]').value.trim();
        const email   = form.querySelector('[name="email"]').value.trim();
        const consent = form.querySelector('[name="consent"]').checked;

        if (!name) {
            showMessage('Vyplňte prosím své jméno.', false);
            return;
        }
        if (!NAME_REGEX.test(name)) {
            showMessage('Jméno smí obsahovat pouze písmena, mezery a pomlčky (min. 2 znaky).', false);
            return;
        }
        if (!phone) {
            showMessage('Vyplňte prosím telefonní číslo.', false);
            return;
        }
        const phoneDigits = phone.replace(/\D/g, '');
        if (!PHONE_REGEX.test(phone) || phoneDigits.length < 9 || phoneDigits.length > 15) {
            showMessage('Zadejte platné telefonní číslo (min. 9 číslic, např. +420 777 123 456).', false);
            return;
        }
        if (!email) {
            showMessage('Vyplňte prosím e-mailovou adresu.', false);
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            showMessage('Zadejte platnou e-mailovou adresu (např. jan@email.cz).', false);
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
