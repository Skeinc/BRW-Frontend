import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { NAV_LINK_CLASS, NAV_LINKS } from '../model/nav-links';

/** Main menu of the desktop header: the catalog link first, then the information pages. */
export function HeaderNav() {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('nav.mainMenu')} className="flex flex-1 items-center justify-center">
      <Link to="/catalog" className={NAV_LINK_CLASS} activeProps={{ className: 'border-primary text-primary' }}>
        {t('nav.catalog')}
      </Link>
      {NAV_LINKS.map(({ to, labelKey }) => (
        <Link key={to} to={to} className={NAV_LINK_CLASS} activeProps={{ className: 'border-primary text-primary' }}>
          {t(labelKey)}
        </Link>
      ))}
    </nav>
  );
}
