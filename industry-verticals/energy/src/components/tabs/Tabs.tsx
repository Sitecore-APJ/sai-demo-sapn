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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';

interface TabsFields {
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

interface TabsComponentProps extends ComponentProps {
  fields: TabsFields;
}

type TabPanelProps = {
  rendering: TabsComponentProps['rendering'];
  params: TabsComponentProps['params'];
  index: number;
  total: number;
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

function TabPanelContent({ rendering, params, index, total, content }: TabPanelProps) {
  const phKey = `tabcolumn-${index}-{*}`;
  const id = params.RenderingIdentifier;
  const className = getItemClassName(index, total, 'tab');

  return (
    <TabsContent value={`tab-${index}`} className={className} id={id || undefined}>
      <div className="flex flex-col gap-4 pt-4">
        <RichText field={content} />
        <Placeholder name={phKey} rendering={rendering} />
      </div>
    </TabsContent>
  );
}

export const Default = ({ rendering, params, fields }: TabsComponentProps) => {
  const { page } = useSitecore();
  const { isEditing } = page.mode;
  const styles = `component tabs ${params.styles ?? ''}`.trimEnd();
  const id = params.RenderingIdentifier;
  const datasource = fields?.data?.datasource;
  const filteredItems = (datasource?.children?.results ?? []).filter(
    (element) => element?.title?.jsonValue
  );

  if (!filteredItems.length) {
    return isEditing ? (
      <div className={styles} id={id}>
        <div className="component-content">[Tabs]</div>
      </div>
    ) : null;
  }

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
        <Tabs defaultValue="tab-0">
          <TabsList>
            {filteredItems.map((element, key) => (
              <TabsTrigger key={key} value={`tab-${key}`}>
                <Text field={element.title!.jsonValue} tag="span" />
              </TabsTrigger>
            ))}
          </TabsList>
          {filteredItems.map((element, key) => (
            <TabPanelContent
              key={key}
              index={key}
              total={filteredItems.length}
              content={element.content?.jsonValue ?? ({ value: '' } as RichTextField)}
              rendering={rendering}
              params={params}
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
