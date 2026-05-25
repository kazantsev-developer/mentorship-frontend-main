import { Spinner } from '@heroui/react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80">
      <Spinner size="lg" color="primary" />
    </div>
  );
}
