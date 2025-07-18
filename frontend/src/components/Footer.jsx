import { useLocation } from "react-router";
import Container from "./Shared/Container";

const Footer = () => {
  const location = useLocation();
  if (
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/dashboard")
  )
    return null;

  return (
    <div className="bg-[var(--secondary)] py-10">
      <Container>
        <div className="flex items-center justify-between flex-col md:flex-row gap-4">
          <div className="space-y-2">
            <div className="flex flex-col items-start">
              <p className="uppercase font-medium">
                Copyright © {new Date().getFullYear()} Flow Media
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="link_css">
                Terms And Conditions
              </a>
              |
              <a href="#" className="link_css">
                Privacy Policy
              </a>
              |
              <a href="https://pub.adsflowmedia.com/panel/auth/register" className="link_css">
                Affiliates
              </a>
              {/* <a href="/affiliate" className="link_css">
                Affiliates
              </a> */}
              |
              <a href="#" className="link_css">
                Contact Us
              </a>
            </div>
          </div>

          <div className="flex items-center flex-col">
            <div>
              <img src="/logo.png" className="max-h-[32px]" alt="logo" />
            </div>
            <p>Watch For LESS!</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
