import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { NAV_LINK_CLASS, NAV_LINKS } from '../model/nav-links';
import { CatalogMenu } from './catalog-menu';

/** Main menu of the desktop header: the catalog drop-down first, then the information pages. */
export function HeaderNav() {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('nav.mainMenu')} className="flex flex-1 items-center justify-center">
      <CatalogMenu />
      {NAV_LINKS.map(({ to, labelKey }) => (
        <Link key={to} to={to} className={NAV_LINK_CLASS} activeProps={{ className: 'border-primary text-primary' }}>
          {t(labelKey)}
        </Link>
      ))}
    </nav>
  );
}
