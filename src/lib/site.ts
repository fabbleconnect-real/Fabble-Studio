export const site = {
  name: "Fabble Studio",
  email: "studiofabble@gmail.com",
  phones: [
    { display: "+91 83769 67600", tel: "+918376967600" },
    { display: "+91 83680 96161", tel: "+918368096161" },
  ],
  // WhatsApp + the default "call us" number
  whatsapp: "918376967600",
  whatsappMessage: "Hi Fabble, I'd like to talk about a project.",
  instagram: {
    handle: "fabble_studio",
    href: "https://www.instagram.com/fabble_studio/",
  },
};

export const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`;
export const callHref = `tel:${site.phones[0].tel}`;

// Chapters shown as markers on the navbar timeline.
export const chapters = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

// The navbar leaves FAQ out; the footer still lists every chapter.
export const navChapters = chapters.filter((c) => c.id !== "faq");
