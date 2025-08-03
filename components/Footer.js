const Footer = () =>{
    return(
              <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h2 className="text-xl font-bold">Simple parking</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Simplifying airport parking for millions of travelers worldwide.
            </p>
            <div className="flex space-x-4">
              {[
                { name: 'twitter', url: 'https://twitter.com/yourcompany' },
                { name: 'facebook', url: 'https://facebook.com/yourcompany' },
                { name: 'instagram', url: 'https://instagram.com/yourcompany' }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors magnetic"
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {[
            { 
              title: "Company", 
              links: [
                { text: "About Us", url: "/Aboutus" },
                { text: "Careers", url: "/Careers" },
                { text: "Blog", url: "/blog" },
                { text: "Help", url: "/help" }
              ] 
            },
            { 
              title: "Support", 
              links: [
                { text: "Help Center", url: "/help" },
                { text: "Contact Us", url: "/help" },
                { text: "Privacy Policy", url: "/PrivacyPolicy" },
                { text: "Terms of Service", url: "/Termsandconditions" }
              ] 
            },
            { 
              title: "Airports", 
              links: [
                { text: "Heathrow (Open)", url: "/search?airport=heathrow", isSearch: true },
                { text: "Gatwick (currently closed)", url: "/search?airport=gatwick", isSearch: true },
                { text: "Manchester (currently closed)", url: "/search?airport=manchester", isSearch: true },
              ] 
            }
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a 
                      href={link.url} 
                      className="text-gray-400 hover:text-white transition-colors magnetic"
                      onClick={link.isSearch ? (e) => {
                        e.preventDefault();
                        // Add your search form navigation logic here
                        // For example, using React Router:
                        // navigate(link.url);
                        // Or scroll to search form:
                        // document.getElementById('search-form').scrollIntoView();
                      } : undefined}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    )
}

export default Footer;