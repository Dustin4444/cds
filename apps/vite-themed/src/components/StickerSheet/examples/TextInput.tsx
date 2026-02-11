import { memo, useState } from "react";
import { TextInput } from "@coinbase/cds-web/controls/TextInput";

export const TextInputExample = memo(() => {
  const [value, setValue] = useState("");

  return (
    <>
      <TextInput
        compact
        label="Label"
        value={value}
        onChangeText={setValue}
        placeholder="Compact input"
        labelVariant="inside"
        style={{ flexGrow: 1 }}
      />
      <TextInput
        label="Label"
        value={value}
        onChangeText={setValue}
        placeholder="Default input"
        labelVariant="inside"
        style={{ flexGrow: 1 }}
      />
      <TextInput
        label="Label"
        value={value}
        onChangeText={setValue}
        placeholder="Outside label"
        style={{ flexGrow: 1 }}
      />
    </>
  );
});
