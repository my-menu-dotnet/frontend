import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomText = { text: string, bold?: boolean, italic?: boolean, underline?: boolean, code?: boolean }
type CustomElement = { type: 'paragraph'; children: CustomText[] }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
} 