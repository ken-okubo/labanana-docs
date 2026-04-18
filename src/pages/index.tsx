import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  IconBulb,
  IconRoute,
  IconShieldLock,
  IconBrush,
  IconScale,
  IconHelp,
  IconArrowRight,
  IconCreditCard,
  IconTruckDelivery,
  IconWallet,
  IconTerminal2,
} from '@tabler/icons-react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs">
            Comece Aqui
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/quickstart"
            style={{marginLeft: '1rem'}}>
            Quickstart
          </Link>
        </div>
      </div>
    </header>
  );
}

interface CardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  link: string;
  cta: string;
}

function Card({icon, title, subtitle, link, cta}: CardProps) {
  return (
    <div className="col col--4">
      <Link to={link} className={styles.card}>
        <div className={styles.cardIcon}>{icon}</div>
        <div className={styles.cardContent}>
          <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>
        <span className={styles.cardCta}>
          {cta} <IconArrowRight size={14} stroke={2} />
        </span>
      </Link>
    </div>
  );
}

const ICON_SIZE = 22;
const ICON_STROKE = 1.5;

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Documentação da plataforma Labanana - Print on Demand API">
      <HomepageHeader />
      <main className="container" style={{padding: '3rem 0'}}>

        <div className={styles.sectionLabel}>Entenda a plataforma</div>
        <div className="row" style={{marginBottom: '2rem'}}>
          <Card
            icon={<IconBulb size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Conceitos"
            subtitle="Assets, Options, Variants e Templates"
            link="/docs/concepts/assets-and-options"
            cta="Explorar"
          />
          <Card
            icon={<IconRoute size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Fluxos"
            subtitle="Guias end-to-end por papel"
            link="/docs/flows/admin-setup"
            cta="Ver guias"
          />
          <Card
            icon={<IconWallet size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Seller Dashboard"
            subtitle="Stats, Wallet e Payouts via PIX"
            link="/docs/flows/seller-dashboard"
            cta="Ver dashboard"
          />
        </div>

        <div className={styles.sectionLabel}>Integrações</div>
        <div className="row" style={{marginBottom: '2rem'}}>
          <Card
            icon={<IconCreditCard size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Pagamentos (Asaas)"
            subtitle="Pix, cartão, boleto, refund e cancel"
            link="/docs/integrations/payments-asaas"
            cta="Ver Asaas"
          />
          <Card
            icon={<IconTruckDelivery size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Frete (Melhor Envio)"
            subtitle="Cálculo, etiqueta automática e polling"
            link="/docs/integrations/shipping-melhor-envio"
            cta="Ver envio"
          />
          <Card
            icon={<IconShieldLock size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Auth e Pedidos"
            subtitle="JWT, CPF/CNPJ, checkout e fulfillment"
            link="/docs/api-reference/auth"
            cta="Ver endpoints"
          />
        </div>

        <div className={styles.sectionLabel}>Construa e integre</div>
        <div className="row" style={{marginBottom: '2rem'}}>
          <Card
            icon={<IconBrush size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Frontend"
            subtitle="Galeria, checkout, tracking e types"
            link="/docs/frontend/public-page"
            cta="Integrar"
          />
          <Card
            icon={<IconScale size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Regras de Negócio"
            subtitle="Preços, validações e soft delete"
            link="/docs/business-logic/overview"
            cta="Consultar"
          />
          <Card
            icon={<IconTerminal2 size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Desenvolvimento"
            subtitle="Tunnel, testes E2E e troubleshooting"
            link="/docs/development/local-testing-tunnel"
            cta="Ver setup"
          />
        </div>

        <div className="row">
          <div className="col col--12" style={{textAlign: 'center', paddingTop: '1rem'}}>
            <Link to="/docs/faq" className={styles.faqInlineLink}>
              <IconHelp size={18} stroke={1.8} style={{verticalAlign: 'middle', marginRight: '0.35rem'}} />
              Dúvidas rápidas no FAQ
            </Link>
          </div>
        </div>

      </main>
    </Layout>
  );
}
