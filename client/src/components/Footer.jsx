import { Footer, FooterCopyright } from "flowbite-react";

export default function FooterComponent() {
  return (
    <Footer
      container
      className="bg-gradient-to-r from-indigo-500 via-purple-600 rounded-none text-center "
    >
      <FooterCopyright
        className="text-white mx-auto"
        by="FULL STACK - MERN APP "
        year={new Date().getFullYear()}
      />
    </Footer>
  );
}
