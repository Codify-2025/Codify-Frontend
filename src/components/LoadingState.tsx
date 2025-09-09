import Text from '@components/Text';

export const LoadingSkeleton = () => (
  <div className="rounded-2xl bg-blue-50 p-6 ring-1 ring-blue-100">
    <div className="h-6 w-48 animate-pulse rounded bg-white/70" />
    <div className="mt-2 h-4 w-32 animate-pulse rounded bg-white/60" />
  </div>
);

export const ErrorState = ({ message }: { message?: string }) => (
  <div className="rounded-2xl bg-red-50 p-6 ring-1 ring-red-100">
    <Text variant="body" className="text-red-700">
      {message ?? '데이터를 불러오지 못했습니다.'}
    </Text>
  </div>
);
