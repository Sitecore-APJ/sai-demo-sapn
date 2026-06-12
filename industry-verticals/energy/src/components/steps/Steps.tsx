'use client';

import {
  Placeholder,
  RichText,
  RichTextField,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface StepsFields {
  data?: {
    datasource?: {
      title?: { jsonValue: TextField };
      children?: {
        results?: Array<{
          title?: { jsonValue: TextField };
          content?: { jsonValue: RichTextField };
        }>;
      };
    };
  };
}

interface StepsComponentProps extends ComponentProps {
  fields: StepsFields;
}

type StepRowProps = {
  rendering: StepsComponentProps['rendering'];
  params: StepsComponentProps['params'];
  index: number;
  total: number;
  title: TextField;
  content: RichTextField;
};

function getItemClassName(index: number, total: number, prefix: string) {
  let className = `${prefix}${index}`;
  className += (index + 1) % 2 === 0 ? ' even' : ' odd';
  if (index === 0) {
    className += ' first';
  }
  if (index + 1 === total) {
    className += ' last';
  }
  return className;
}

function StepRow({ rendering, params, index, total, title, content }: StepRowProps) {
  const phKey = `steprow-${index}-{*}`;
  const id = params.RenderingIdentifier;
  const className = getItemClassName(index, total, 'step');

  return (
    <li className={`${className} relative flex gap-4 pb-8 last:pb-0`} id={id || undefined}>
      <div className="flex flex-col items-center">
        <span className="bg-accent text-background flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
          {index + 1}
        </span>
        {index + 1 < total - 1 && <span className="bg-border mt-2 h-full w-px" />}
      </div>
      <div className="min-h-[100px] flex-1">
        <Text tag="h2" field={title} className="mb-3 text-lg font-semibold" />
        <div className="flex flex-col gap-4">
          <RichText field={content} />
          <Placeholder name={phKey} rendering={rendering} />
        </div>
      </div>
    </li>
  );
}

export const Default = ({ rendering, params, fields }: StepsComponentProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const styles = `component steps ${params.styles ?? ''}`.trimEnd();
  const id = params.RenderingIdentifier;
  const datasource = fields?.data?.datasource;
  const items = (datasource?.children?.results ?? []).filter(
    (element) => element?.title?.jsonValue
  );

  if (!items.length) {
    return isEditing ? (
      <div className={styles} id={id}>
        <div className="component-content">[Steps]</div>
      </div>
    ) : null;
  }

  const steps = items.map((element, key) => (
    <StepRow
      key={key}
      index={key}
      total={items.length}
      title={element.title!.jsonValue}
      content={element.content?.jsonValue ?? ({ value: '' } as RichTextField)}
      rendering={rendering}
      params={params}
    />
  ));

  return (
    <div className={styles} id={id || undefined}>
      <div className="component-content">
        {datasource?.title?.jsonValue && (
          <Text
            tag="h4"
            field={datasource.title.jsonValue}
            className="mb-6 text-lg font-semibold"
          />
        )}
        <ol className="flex w-full flex-col">{steps}</ol>
      </div>
    </div>
  );
};
