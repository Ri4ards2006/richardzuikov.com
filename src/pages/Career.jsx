import React from 'react';
import { useLanguage } from '../hooks/use-language';
import Screen from '../components/atlus/Screen';
import RecordBoard from '../components/atlus/RecordBoard';

export default function Career() {
  const { t } = useLanguage();

  return (
    <Screen id="career" number="04" title={t.landing.nav.career} hud={t.atlus.hud.career}>
      <RecordBoard />
    </Screen>
  );
}
