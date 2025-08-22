document.getElementById("ano").textContent = new Date().getFullYear();

// Conversão: captura UTM / origem e salva no localStorage
(function trackUTM() {
  const params = new URLSearchParams(location.search);

  const utm = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "gclid",
    "fbclid",
  ].reduce(
    (a, k) => {
      const v = params.get(k);
      if (v) a[k] = v;
      return a;
    },

    {}
  );

  if (Object.keys(utm).length)
    localStorage.setItem(
      "utm",
      JSON.stringify({
        ...utm,
        ts: Date.now(),
      })
    );
})();

// Validação simples do formulário e envio com EmailJS
const form = document.getElementById("quoteForm");
const msg = document.getElementById("formMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const data = Object.fromEntries(new FormData(form));

  // Validação de campos obrigatórios
  if (!data.name || !data.message || !data.title) {
    msg.textContent = "Preencha os campos obrigatórios.";
    msg.style.color = "#ffb4b4";
    return;
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    msg.textContent = "Formato de email inválido.";
    msg.style.color = "#ffb4b4";
    return;
  }

  // Validação de WhatsApp (se preenchido)
  if (data.whats) {
    // Remove caracteres não numéricos para validação
    const whatsNumerico = data.whats.replace(/\D/g, "");
    if (whatsNumerico.length < 10 || whatsNumerico.length > 11) {
      msg.textContent = "Número de WhatsApp inválido.";
      msg.style.color = "#ffb4b4";
      return;
    }

    // Concatena nome com WhatsApp no título
    data.title += ` - ${data.name} (WhatsApp: ${data.whats})`;
  }

  // Validação do tipo de projeto
  // const tiposValidos = [
  //   "MVP do zero",
  //   "App Web",
  //   "App Mobile",
  //   "Landing Page",
  //   "Site institucional",
  //   "Integração/API",
  //   "Business Intelligence",
  // ];
  if (!data.title) {
    msg.textContent = "Selecione um tipo de projeto válido.";
    msg.style.color = "#ffb4b4";
    return;
  }

  // Validação do tamanho da descrição
  if (data.message.length < 10) {
    msg.textContent = "A descrição deve ter pelo menos 10 caracteres.";
    msg.style.color = "#ffb4b4";
    return;
  }

  const payload = {
    ...data,
    utm: localStorage.getItem("utm")
      ? JSON.parse(localStorage.getItem("utm"))
      : null,
  };

  try {
    // Envia usando EmailJS
    await emailjs.send(
      "service_dko3wsr",
      "template_glbj8jd",
      payload // Aqui estamos usando o payload completo
    );

    msg.textContent = "Recebido! Respondemos em até 24h úteis.";
    msg.style.color = "#b8f5d8";
    form.reset();
  } catch (err) {
    console.error("Erro ao enviar:", err);
    msg.textContent = "Não foi possível enviar agora. Tente novamente.";
    msg.style.color = "#ffb4b4";
  }
});

// Acessibilidade: focar CTA ao pressionar Alt+K
window.addEventListener("keydown", (e) => {
  if (e.altKey && e.key.toLowerCase() === "k")
    document.getElementById("ctaTop").focus();
});
