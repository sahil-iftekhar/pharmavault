import styles from './services.module.css';

export default function Services() {
  const services = [
    {
      icon: '💊',
      title: 'Prescription Filling',
      description: 'Quick and accurate prescription services'
    },
    {
      icon: '⏰',
      title: '24/7 Service',
      description: 'Always open for your health needs'
    },
    {
      icon: '🚚',
      title: 'Home Delivery',
      description: 'Convenient delivery to your doorstep'
    },
  ];

  return (
    <section className={styles.services}>
      <h2>Our Services</h2>
      <div className={styles.grid}>
        {services.map((service, index) => (
          <div key={index} className={styles.service}>
            <div className={styles.icon}>{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

