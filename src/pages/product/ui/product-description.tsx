interface ProductDescriptionProps {
  text: string;
}

export function ProductDescription({ text }: ProductDescriptionProps) {
  return <p className="whitespace-pre-line text-muted-foreground">{text}</p>;
}
