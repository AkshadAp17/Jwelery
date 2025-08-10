export default function WhyChooseUs() {
  const features = [
    {
      icon: "fas fa-certificate",
      title: "Certified Quality",
      description: "All our jewelry comes with proper hallmarking and certification for purity guarantee."
    },
    {
      icon: "fas fa-tools",
      title: "Master Craftsmanship",
      description: "Our skilled artisans create each piece with precision and attention to detail."
    },
    {
      icon: "fas fa-exchange-alt",
      title: "Easy Exchange",
      description: "Flexible exchange policies and lifetime maintenance services for your peace of mind."
    },
    {
      icon: "fas fa-headset",
      title: "Personal Service",
      description: "Dedicated customer support and personalized consultation for your special moments."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-playfair text-4xl font-bold text-navy mb-4">Why Choose Shree Jewellers?</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            With over 25 years of expertise, we bring you the finest jewelry with unmatched quality and service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold group-hover:bg-opacity-100 transition-all duration-300">
                <i className={`${feature.icon} text-gold text-2xl group-hover:text-white transition-colors duration-300`}></i>
              </div>
              <h4 className="font-semibold text-lg text-navy mb-3">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
