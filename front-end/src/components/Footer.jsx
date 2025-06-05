import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white shadow-inner py-6 px-6 mt-12 text-center text-gray-600 text-sm">
      <div className="max-w-6xl mx-auto">
        <p>© {new Date().getFullYear()} Moon Rock Cafe. All rights reserved.</p>

        <div className="mt-4 flex justify-center space-x-6">
          {/* Instagram */}
          <a
            href="#"
            aria-label="Instagram"
            className="text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M7.75 2C4.679 2 2 4.679 2 7.75v8.5C2 19.321 4.679 22 7.75 22h8.5c3.071 0 5.75-2.679 5.75-5.75v-8.5C22 4.679 19.321 2 16.25 2h-8.5zm8.25 2a1 1 0 110 2 1 1 0 010-2zm-4.25 2.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zM12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            </svg>
          </a>

          {/* Twitter */}
          <a
            href="#"
            aria-label="Twitter"
            className="text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M22.46 6c-.77.35-1.5.6-2.28.7a4.005 4.005 0 001.74-2.2 7.986 7.986 0 01-2.54.97A3.998 3.998 0 0016.1 5c-2.22 0-4.02 1.8-4.02 4.02 0 .31.04.62.1.91A11.36 11.36 0 013 6.09a4.04 4.04 0 001.24 5.37 4.004 4.004 0 01-1.82-.5v.05c0 1.9 1.35 3.48 3.14 3.84a4.01 4.01 0 01-1.8.07 4.025 4.025 0 003.75 2.79A8.034 8.034 0 012 19.54a11.3 11.3 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.68 0-.18-.01-.35-.02-.53A8.33 8.33 0 0022.46 6z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="#"
            aria-label="Facebook"
            className="text-gray-600 hover:text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54v-2.21c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.76-1.61 1.54v1.89h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 17 22 12z" />
            </svg>
          </a>
        </div>

        <p className="mt-2">
          <a href="/privacy" className="hover:text-blue-600 underline mx-2">
            Privacy Policy
          </a>
          |
          <a href="/terms" className="hover:text-blue-600 underline mx-2">
            Terms of Service
          </a>
          |
          <a href="/contact" className="hover:text-blue-600 underline mx-2">
            Contact Us
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;


// This code defines a simple footer component for a React application.
// It includes social media links, copyright information, and links to privacy policy, terms of service, and contact us pages.
// The footer is styled with Tailwind CSS classes for a clean and modern look.
// The social media icons are SVGs that change color on hover.
// The footer is responsive and adapts to different screen sizes, ensuring a consistent user experience across devices.
// The component is designed to be reusable and can be easily integrated into any page of the application.
// The footer enhances the overall user experience by providing essential links and social media connections,
// making it easier for users to navigate and engage with the cafe's online presence.
// The Footer component is a functional React component that serves as the footer for the cafe website.
// It includes links to social media, privacy policy, terms of service, and contact information.
// The footer is styled with Tailwind CSS for a clean and modern look.      