import * as React from "react";
import { TagPicker, ITag, IBasePickerSuggestionsProps } from "@fluentui/react";

export interface IKeywordTaggerComponentProps {
  name?: string;
  inputField?: string;
  updateValue: (value: ITag[]) => void;
}

const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: "",
  noResultsFoundText: "",
};

export const KeywordTaggerComponent: React.FC<IKeywordTaggerComponentProps> = ({
  name,
  inputField,
  updateValue,
}) => {
  const [tags, setTags] = React.useState<ITag[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    if (inputField) {
      const initialTags = inputField
        .split(",")
        .map((tag) => ({ key: tag.trim(), name: tag.trim() }));
      setTags(initialTags);
      updateValue(initialTags);
    }
  }, [inputField, updateValue]);

  const onTagChange = (items?: ITag[]) => {
    setTags(items || []);
    updateValue(items || []);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const newTag: ITag = {
        key: event.currentTarget.value,
        name: event.currentTarget.value,
      };
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      updateValue(updatedTags);
      setInputValue(""); // Clear the input value
      event.preventDefault();
    }
  };

  return (
    <div>
      <TagPicker
        onResolveSuggestions={() => []}
        onEmptyResolveSuggestions={() => []}
        selectedItems={tags}
        onChange={onTagChange}
        inputProps={{
          onKeyDown: onInputKeyDown,
          value: inputValue, // Bind the input value to the state
          placeholder: "Type and press enter to add a tag",
        }}
        pickerSuggestionsProps={pickerSuggestionsProps}
        styles={{
          root: {
            borderRadius: "5px",
          },
          text: {
            borderRadius: "5px",
          },
          input: {
            borderRadius: "5px",
          },
          itemsWrapper: {
            borderRadius: "5px",
          },
        }}
      />
    </div>
  );
};
