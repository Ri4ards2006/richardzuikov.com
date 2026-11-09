import React, { useState } from 'react';
import { useLanguage } from '../hooks/use-language';
import Screen from '../components/atlus/Screen';
import SkillBoard from '../components/atlus/SkillBoard';

// Same order as career.domains: lowLevel, infra, hardware, software.
const PROPS = ['chip', 'rackUnit', 'oscilloscope', 'browserFrame'];

// SkillBoard is the sub-menu (category slabs) and the detail panel; the prop follows the category.
export default function Stack() {
  const { t } = useLanguage();
  const [category, setCategory] = useState(0);

  return (
    <Screen id="stack" number="03" title={t.landing.nav.stack} hud={t.atlus.hud.stack} prop={PROPS[category]}>
      <SkillBoard onCategory={setCategory} showProp={false} />
    </Screen>
  );
}
