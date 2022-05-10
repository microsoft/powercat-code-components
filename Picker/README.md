# Tag Picker

The Tag Picker code component provides the following features:

1. Binds to an input collection for the chosen tags
2. Binds to an input collection for suggested tags
3. Allows users to select from suggestions or enter a free text tag
4. Raises **On Change** event when a user adds or removes a tag
5. Allows programmatic **Set Focus**
6. Styled to closely match the PILL Spec.

## Datasets

The Tag Picker has the following input datasets:

- `Tags` - A collection/table of tags. The app is responsible for adding/removing tags in responsive to the component raising Add/Remove events (see below).
  - `TagDisplayName` - set to the name of the column that holds the tag display name
- `Suggestions` - A collection/table of suggestions.
  - `SuggestionDisplayName` - set to the name of the column that holds the suggestion display name.
  - `SuggestionSubDisplayName` (Optional) - set to the name of the column that holds the secondary line of text.

The suggestions dataset should be filtered using the `SearchTerm` output property - e.g.

```vb
Search(colSuggestions,TagPicker.SearchTerm,"name")
```

## Input Properties

The `TagPicker` component has the following input properties:

- **Tag Max Width** - The maximum width of the tags when rendering. Overflow text will be truncated with ellipsis's and a hover tooltip shows the full text.

- **Allow Free Text** - When typing a value, do not not automatically select the first suggestion so that a free text entry can be provided rather than selecting from a pre-defined list.

- **Search Term To Short Message** - The message to display when the **Search Term** is less than the **Minimum Search Term Length**.

- **Hint Text** - The message to display inside the Picker when no search term is provided.

- **No Suggestions Found Message** - The message to display when the Suggestions collection contains no results.

- **Minimum Search Term Length** - The minimum number of character to trigger the suggestions flyout.

- **Max Tags** - The maximum number of tags that can be added. After this number, the Tag Picker will be re-only until a tag is removed.

- **Error** - True when the red error border should be displayed.

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.

- **Font Size** - the font size of the tags shown inside the Picker.

- **Border Radius** - the border radius of the tags shown inside the Picker.

- **Item Height** - the height of the tags (pixesl) shown inside the Picker.

- **AccessibilityLabel** - Screen reader aria-label

- **Input Event** - Set to the event to sent to the `TagPicker`:

  - `SetFocus` - Set a context variable that is bound to the Input Event property - followed by a random element to ensure the event fires the update to the code component. E.g.

    ```vb
    UpdateContext({
        ctxTagPickerSetFocus:"SetFocus" & Text(Rand())
    });
    ```

## On Change event

The `TagPicker` component raises an `OnChange` event when tags are added or removed. The properties used are:

- **TagEvent** - the name of the event raised
- **TagKey** - the key of the item that has raised the event (if the event is related to a tag)

The event should contain an expression similar to:

```vb
If(TagPicker.TagEvent="Add" && CountRows(Filter(colTags,name=TagPicker.TagDisplayName))=0,
    Collect(colTags,{name:TagPicker.TagDisplayName})
);

If(TagPicker.TagEvent="Remove",
 RemoveIf(colTags,name=Text(TagPicker.TagDisplayName))
);
```

## Output Properties

The `TagPicker` component has the following output properties:

- **Search Term** - The text entered into the Tag Picker that can be used for filtering the suggestions dataset.
- **Tag Display Name** - the text that is used to create a new **Tag** when the **On Change** event is fired
- **Auto Height** - When the tag picker wraps onto multiple lines, the **Auto Height** property can be used to control the height of a responsive container height.
