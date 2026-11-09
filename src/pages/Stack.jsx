import React from 'react';
import { useLanguage } from '../hooks/use-language';
import Screen from '../components/atlus/Screen';
import SkillBoard from '../components/atlus/SkillBoard';

export default function Stack() {
  const { t } = useLanguage();

  return (
    <Screen id="stack" number="03" title={t.landing.nav.stack} hud={t.atlus.hud.stack}>
      <SkillBoard />
    </Screen>
  );
}
