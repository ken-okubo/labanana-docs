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
            icon={<IconShieldLock size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Auth e Pedidos"
            subtitle="JWT, checkout e fulfillment"
            link="/docs/api-reference/auth"
            cta="Ver endpoints"
          />
        </div>

        <div className={styles.sectionLabel}>Construa e integre</div>
        <div className="row">
          <Card
            icon={<IconBrush size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Frontend"
            subtitle="Galeria, filtros e TypeScript types"
            link="/docs/frontend/public-page"
            cta="Integrar"
          />
          <Card
            icon={<IconScale size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="Regras de Negocio"
            subtitle="Precos, validacoes e soft delete"
            link="/docs/business-logic/overview"
            cta="Consultar"
          />
          <Card
            icon={<IconHelp size={ICON_SIZE} stroke={ICON_STROKE} />}
            title="FAQ"
            subtitle="Respostas rapidas"
            link="/docs/faq"
            cta="Ver FAQ"
          />
        </div>

      </main>
    </Layout>
  );
}
