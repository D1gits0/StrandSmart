/**
 * src/data/content.js
 *
 * Single source of truth for all UI text on the landing page.
 * To connect to an API later, replace the static values here with
 * fetched data (e.g. from a CMS or REST endpoint) and re-export
 * in the same shape — no component changes required.
 */

// ─── Hero (PageHeader) ────────────────────────────────────────────────────────
export const hero = {
  heading: "Strandsmart",
  subtext: "Your Vision, Unified.",
  primaryCta: {
    label: "Get Started",
    href: "/register-page",
  },
  secondaryCta: {
    label: "Learn More",
    href: "/about-page",
  },
};

// ─── Boom / Typed section ─────────────────────────────────────────────────────
export const boom = {
  prefix: "Disorder",
  typedStrings: ["Journey"],
  typeSpeed: 300,
};

// ─── About Section ────────────────────────────────────────────────────────────
export const about = {
  heading: "About Us",
  quote:
    "Strandsmart is dedicated to providing resources, support, and community for those dealing with trichotillomania. Our mission is to normalize the condition and offer practical guidance for managing it.",
  primaryCta: { label: "Read Our Story", href: "/about-page" },

  resources: {
    heading: "Resources",
    body: "Discover information to help you understand and manage trichotillomania. Our articles, guides, and stories offer practical tips, expert advice, and support. Learn about the condition, explore coping strategies, and connect with others.",
  },

  cards: [
    {
      id: "articles",
      image: "strandsmartlogo.png",
      alt: "Articles",
      linkTo: "/landing-page",
      cta: "See Articles",
    },
    {
      id: "blog",
      image: "strandsmartlogo.png",
      alt: "Blog",
      linkTo: "/profile-page",
      cta: "See Blog",
    },
  ],
};

// ─── More / Community Section ─────────────────────────────────────────────────
export const community = {
  heading: "Community",
  quote:
    "Connect with others who understand your experience. Share your story, ask questions, and find support in our safe and welcoming community.",
  redditCta: {
    label: "Join Us on Reddit",
    href: "https://www.reddit.com/r/trichotillomania",
  },

  getInvolved: {
    heading: "Get Involved",
    body: "Join us in raising awareness about trichotillomania. Participate in campaigns, share our resources, and help make a difference.",
    cta: { label: "Learn How", href: "/about-page" },
  },
};

// ─── Signup Section ───────────────────────────────────────────────────────────
export const signup = {
  heading: "Sign Up",
  body: "Sign up to receive practical tips, expert advice, and the latest updates straight to your inbox. Stay connected and informed on managing trichotillomania.",
  form: {
    title: "Register",
    fields: {
      fullName: { placeholder: "Full Name", type: "text" },
      email: { placeholder: "Email", type: "email" },
    },
    submitLabel: "Get Started",
  },
};

// ─── Register Page ────────────────────────────────────────────────────────────
export const registerPage = {
  form: {
    title: "Create Account",
    fields: {
      fullName: { placeholder: "Full Name", type: "text" },
      email: { placeholder: "Email", type: "email" },
      password: { placeholder: "Password", type: "password" },
    },
    termsLabel: "I agree to the terms and conditions",
    submitLabel: "Get Started",
    loginPrompt: "Already have an account?",
    loginLabel: "Sign In",
    loginHref: "/login-page",
  },
};

// ─── Login Page ───────────────────────────────────────────────────────────────
export const loginPage = {
  form: {
    title: "Welcome Back",
    fields: {
      email: { placeholder: "Email", type: "email" },
      password: { placeholder: "Password", type: "password" },
    },
    submitLabel: "Sign In",
    registerPrompt: "Don't have an account?",
    registerLabel: "Sign Up",
    registerHref: "/register-page",
  },
};
