'use client';

import React, { useEffect } from 'react';
import {
  WidgetDataType,
  widget,
  useQuestions,
  type QuestionsInitialState,
} from '@sitecore-search/react';
import type { QuestionAnswerModel, IQuestionAnswerSettings } from '@/types/search';
import { usePreviewKeyphrase } from '@/context/SearchContext';
import { applySearchSources } from '@/lib/search/searchQuery';

type InitialState = QuestionsInitialState<'keyphrase'>;

interface QuestionAndAnswerProps {
  settings: IQuestionAnswerSettings;
}

let keyphrase = '';

export const QuestionAndAnswerComponent: React.FC<QuestionAndAnswerProps> = ({ settings }) => {
  const [previewKeyphrase] = usePreviewKeyphrase();
  const {
    widgetRef,
    actions: { onKeyphraseChanged },
    queryResult: {
      isFetching,
      isLoading,
      data: {
        answer: { answer, question } = {
          answer: undefined,
          question: undefined,
        },
      } = {},
    },
  } = useQuestions<QuestionAnswerModel, InitialState>({
    query: (query) => {
      applySearchSources(query);
    },
    state: {
      keyphrase: settings.DefaultQuestion,
    },
  });

  useEffect(() => {
    if (keyphrase !== previewKeyphrase) {
      keyphrase = previewKeyphrase;
      if (!keyphrase) {
        keyphrase = settings.DefaultQuestion;
      }
      onKeyphraseChanged({ keyphrase });
    }
  }, [onKeyphraseChanged, previewKeyphrase, settings.DefaultQuestion]);

  const isLoaded = !isLoading && !isFetching;

  if (!isLoaded || !answer) {
    return null;
  }

  return (
    <section ref={widgetRef} className="flex justify-center py-6">
      <div className="rounded-md p-6">
        <div className="flex flex-col items-center gap-8 md:gap-10">
          {question && (
            <h3 className="text-foreground text-center text-xl font-bold md:text-3xl">
              {question}
            </h3>
          )}
          <p className="text-foreground-light max-w-3xl text-center text-base md:text-xl">
            {answer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default widget(QuestionAndAnswerComponent, WidgetDataType.QUESTIONS, 'content');
