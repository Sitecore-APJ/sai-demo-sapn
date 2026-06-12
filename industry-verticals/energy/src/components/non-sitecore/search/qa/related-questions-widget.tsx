'use client';

import React, { useEffect } from 'react';
import {
  WidgetDataType,
  widget,
  useQuestions,
  type QuestionsInitialState,
} from '@sitecore-search/react';
import type { QuestionAnswerModel, IRelatedQuestionsSettings } from '@/types/search';
import { useSearchContext } from '@/context/SearchContext';
import { applySearchSources } from '@/lib/search/searchQuery';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/components/ui/accordion';
import Spinner from '@/components/non-sitecore/search/Spinner';

type InitialState = QuestionsInitialState<'relatedQuestions' | 'keyphrase'>;

interface RelatedQuestionsProps {
  settings: IRelatedQuestionsSettings;
}

let keyphrase = '';

export const RelatedQuestionsComponent: React.FC<RelatedQuestionsProps> = ({ settings }) => {
  const [searchKeyphrase] = useSearchContext();
  const {
    widgetRef,
    actions: { onKeyphraseChanged },
    queryResult: { isFetching, isLoading, data: { related_questions: relatedQuestions = [] } = {} },
  } = useQuestions<QuestionAnswerModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      relatedQuestions: settings.NumberOfItems,
      keyphrase: settings.DefaultQuestion,
    },
  });

  useEffect(() => {
    if (keyphrase !== searchKeyphrase) {
      keyphrase = searchKeyphrase;
      if (!keyphrase) {
        keyphrase = settings.DefaultQuestion;
      }
      onKeyphraseChanged({ keyphrase });
    }
  }, [onKeyphraseChanged, searchKeyphrase, settings.DefaultQuestion]);

  const isLoaded = !isLoading && !isFetching;

  if (!relatedQuestions.length) {
    return null;
  }

  return (
    <div ref={widgetRef} className="relative">
      {!isLoaded && <Spinner loading />}
      {settings.DisplayTitle && settings.Title && (
        <h4 className="text-foreground mb-4 text-lg font-semibold">{settings.Title}</h4>
      )}
      <Accordion type="multiple" className="w-full pt-2">
        {relatedQuestions.map(({ answer, question }, index) => (
          <AccordionItem key={index} value={`related-${index}`}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default widget(RelatedQuestionsComponent, WidgetDataType.QUESTIONS, 'content');
