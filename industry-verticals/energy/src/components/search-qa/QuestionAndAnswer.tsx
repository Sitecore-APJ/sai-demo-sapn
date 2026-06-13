'use client';

import { ComponentProps } from '@/lib/component-props';
import { parseQuestionAnswerSettings } from '@/lib/search/parseSearchParams';
import { SearchAuthoringChrome } from '@/lib/search/SearchAuthoringChrome';
import { useSearchAuthoring } from '@/lib/search/useSearchAuthoring';
import QuestionAnswerWidget from '@/components/non-sitecore/search/qa/question-answer-widget';
import { QUESTION_ANSWER_WIDGET_ID } from '@/constants/search';

export const Default = (props: ComponentProps) => {
  const isAuthoring = useSearchAuthoring();
  const containerStyles = props.params?.Styles ? props.params.Styles : '';
  const styles = `${props.params?.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const id = props.params.RenderingIdentifier;
  const searchSettings = parseQuestionAnswerSettings(props.params);
  const rfkId = searchSettings.SearchWidgetId || QUESTION_ANSWER_WIDGET_ID;

  if (isAuthoring) {
    return (
      <div className={`component question-and-answer-default ${styles}`} id={id || undefined}>
        <div className="component-content">
          <SearchAuthoringChrome label="Question and Answer" />
        </div>
      </div>
    );
  }

  return (
    <div className={`component question-and-answer-default ${styles}`} id={id || undefined}>
      <div className="component-content">
        <QuestionAnswerWidget settings={searchSettings} rfkId={rfkId} />
      </div>
    </div>
  );
};
