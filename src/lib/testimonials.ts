// Client testimonials for the "Kind words" carousel.
// `name` is the person or, when no person is named, the brand. `role` and `company` are optional
// and shown as "role · company" under the name. `sample: true` marks a layout placeholder; it
// renders a visible "Sample" badge so it can't pass as a genuine review.
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  service: "Website" | "Video";
  avatar?: string; // optional photo or logo in /public/media/clients; initials are used otherwise
  sample?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We love the fresh website for our formal pants manufacturing brand — simple yet elegant, easy to navigate, and it truly captures our aesthetic. Fantastic work!",
    name: "Superb Stitch",
    role: "Formal pants manufacturer",
    service: "Website",
  },
  {
    quote: "Within seconds of watching, I knew this video would grab attention. The visuals are crisp and the message comes across so clearly. Truly impressive work!",
    name: "Vikram",
    role: "Business owner",
    service: "Video",
  },
  {
    quote:
      "We're thrilled with the website created for Geo Builders — it beautifully showcases our construction projects and expertise. They have categorised our products neatly, and has already helped us making a digital presence.",
    name: "Geo Builders",
    role: "Construction company",
    service: "Website",
  },
  {
    quote: "This video has already boosted engagement on our social pages significantly. Creative, polished, and exactly what we needed.",
    name: "Neha",
    role: "Social media manager",
    service: "Video",
  },
  {
    quote:
      "We're impressed with the website created for our business — We like overall design and all products can be found easily by the user. It's even helped us get more leads through WhatsApp. Great work!",
    name: "SS Enterprises",
    role: "Chemical trading company",
    service: "Website",
  },
  {
    quote: "The motion graphics video brought our brand story to life in a way we never imagined. Smooth animations and perfect pacing throughout.",
    name: "Karan",
    role: "Brand founder",
    service: "Video",
  },
];
