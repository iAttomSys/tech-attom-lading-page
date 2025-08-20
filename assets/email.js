// Inicializa EmailJS (substitua pelo seu User ID)
(function () {
  emailjs.init("PreLiRK6ZZcXqd67q"); // pegue no painel do EmailJS
})();

// Captura o envio do formulário
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const form = document.getElementById("quoteForm");
    const msg = document.getElementById("formMsg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "";

      const data = Object.fromEntries(new FormData(form));

      // Regras mínimas
      if (!data.nome || !data.email || !data.desc || !data.tipo) {
        msg.textContent = "Preencha os campos obrigatórios.";
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

        msg.textContent = "Recebido! Respondemos em até 24h.";
        msg.style.color = "#b8f5d8";
        form.reset();
      } catch (err) {
        console.error("Erro ao enviar:", err);
        msg.textContent = "Não foi possível enviar agora. Tente novamente.";
        msg.style.color = "#ffb4b4";
      }
    });
  });
