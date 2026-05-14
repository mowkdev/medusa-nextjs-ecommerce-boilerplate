import { PageNotFound } from "@/components/page-not-found";

export default function CheckoutNotFound() {
  return (
    <PageNotFound
      eyebrow="Cart missing"
      title="Nothing to check out"
      message="Add something to your bench before heading to checkout."
      ctaLabel="Browse the workshop"
      ctaHref="/products"
    />
  );
}
