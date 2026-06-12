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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/components/ui/accordion';
import { paramFlag } from '@/lib/search/parseSearchParams';

interface AccordionFields {
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

interface AccordionComponentProps extends ComponentProps {
  fields: AccordionFields;
}

type AccordionRowProps = {
  rendering: AccordionComponentProps['rendering'];
  params: AccordionComponentProps['params'];
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

function AccordionRow({ rendering, params, index, total, title, content }: AccordionRowProps) {
  const phKey = `accordionrow-${index}-{*}`;
  const id = params.RenderingIdentifier;
  const className = getItemClassName(index, total, 'accordion');

  return (
    <AccordionItem value={`accordion-${index}`} className={className} id={id || undefined}>
      <AccordionTrigger>
        <Text field={title} tag="span" className="text-base font-semibold" />
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4">
          <RichText field={content} />
          <Placeholder name={phKey} rendering={rendering} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export const Default = ({ rendering, params, fields }: AccordionComponentProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const styles = `component accordion ${params.styles ?? ''}`.trimEnd();
  const id = params.RenderingIdentifier;
  const allowMultiple = paramFlag(params.AllowMultiple as string, false);
  const datasource = fields?.data?.datasource;
  const items = datasource?.children?.results ?? [];

  if (!items.length) {
    return isEditing ? (
      <div className={styles} id={id}>
        <div className="component-content">[Accordion]</div>
      </div>
    ) : null;
  }

  const accordionItems = items
    .filter((element) => element?.title?.jsonValue)
    .map((element, key) => (
      <AccordionRow
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
            className="mb-4 text-lg font-semibold"
          />
        )}
        <Accordion
          type={allowMultiple ? 'multiple' : 'single'}
          collapsible={!allowMultiple}
          className="border-border border-l-accent w-full border border-l-8"
        >
          {accordionItems}
        </Accordion>
      </div>
    </div>
  );
};
