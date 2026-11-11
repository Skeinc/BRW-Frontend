import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { catalogRoomCollectionQueryOptions } from '@/entities/room';
import { ProductCatalog } from '@/widgets/product-catalog';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { CollapsibleText } from '@/shared/ui/collapsible-text';
import { ConsultationCollection } from './consultation-collection';
import { SolutionDetails } from './solution-details';
import { SolutionElements } from './solution-elements';
import { SolutionStrip } from './solution-strip';

const route = getRouteApi('/room/$roomId/$collectionId');

export function RoomCollectionPage() {
  const { t } = useTranslation();
  const { roomId, collectionId } = route.useParams();
  const { solution: solutionId, ...catalogSearch } = route.useSearch();
  const search = { q: catalogSearch.q, sort: catalogSearch.sort, page: catalogSearch.page };
  const navigate = route.useNavigate();
  const { data } = useSuspenseQuery(catalogRoomCollectionQueryOptions(roomId, collectionId));
  const { room, collection, solutions } = data;
  const selected = solutions.find(({ id }) => id === solutionId) ?? solutions.at(0);
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: room.name, to: { roomId: room.id } }, { label: collection.name }]} />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {t('rooms.collectionTitle', { room: room.name, name: collection.name })}
      </h1>
      {room.isConsultationOnly ? (
        <ConsultationCollection collection={collection} />
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {selected && (
            <SolutionStrip collectionName={collection.name} solutions={solutions} selectedId={selected.id} />
          )}
          {collection.description && (
            <section aria-labelledby="about-collection" className="max-w-3xl">
              <h2 id="about-collection" className="mb-3 text-xl font-bold tracking-tight">
                {t('rooms.aboutCollection', { name: collection.name })}
              </h2>
              <CollapsibleText text={collection.description} />
            </section>
          )}
          {selected && <SolutionDetails solution={selected} />}
          {selected && selected.products.length > 0 && <SolutionElements products={selected.products} />}
          <section aria-labelledby="all-elements">
            <h2 id="all-elements" className="mb-4 text-xl font-bold tracking-tight">
              {t('rooms.allCollectionElements')}
            </h2>
            <ProductCatalog
              search={search}
              pinned={{ collection: collection.slug }}
              withFilters={false}
              onSearchChange={(next) => void navigate({ search: { ...next, solution: solutionId } })}
            />
          </section>
        </div>
      )}
    </section>
  );
}
