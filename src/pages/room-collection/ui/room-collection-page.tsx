import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { catalogRoomCollectionQueryOptions } from '@/entities/room';
import { BreadcrumbTrail } from '@/shared/ui/breadcrumb-trail';
import { Button } from '@/shared/ui/button';
import { CollapsibleText } from '@/shared/ui/collapsible-text';
import { SolutionCard } from './solution-card';

const route = getRouteApi('/room/$roomId/$collectionId');

export function RoomCollectionPage() {
  const { t } = useTranslation();
  const { roomId, collectionId } = route.useParams();
  const { data } = useSuspenseQuery(catalogRoomCollectionQueryOptions(roomId, collectionId));
  const { room, collection, solutions } = data;
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <BreadcrumbTrail steps={[{ label: room.name, to: { roomId: room.id } }, { label: collection.name }]} />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {t('rooms.collectionTitle', { room: room.name, name: collection.name })}
      </h1>
      {collection.description && (
        <div className="mt-4 max-w-3xl">
          <CollapsibleText text={collection.description} />
        </div>
      )}
      <div className="mt-8 flex flex-col gap-6">
        {solutions.map((solution) => (
          <SolutionCard key={solution.id} solution={solution} />
        ))}
      </div>
      <div className="mt-8">
        <Button asChild variant="outline">
          <Link to="/collection/$collectionId" params={{ collectionId: collection.id }}>
            {t('rooms.allElements')}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
