import { PageNotFound } from "@/components/page-not-found";

export default function CartNotFound() {
  return (
    <PageNotFound
      eyebrow="Empty"
      title="No cart here"
      message="We couldn't find the cart you're after. Start a new bench by adding something from the workshop."
    />
  );
}
