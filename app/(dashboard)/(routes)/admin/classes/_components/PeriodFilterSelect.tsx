'use client';

import { MantineSelectOption } from '@/types';
import { Select } from '@mantine/core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const PeriodFilterSelect = ({
  periodOptions,
  currentPeriodId,
}: {
  periodOptions: MantineSelectOption[];
  currentPeriodId: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [period, setPeriod] = useState(
    searchParams.get('period') || currentPeriodId
  );

  const handleFilter = (newPeriod: string | null) => {
    setPeriod(newPeriod || '');
    const params = new URLSearchParams(searchParams);
    !newPeriod ? params.delete('period') : params.set('period', newPeriod);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select
      value={period}
      onChange={handleFilter}
      placeholder='Period'
      data={periodOptions}
      searchable
      checkIconPosition='right'
    />
  );
};

export default PeriodFilterSelect;
