import Pricing from "@/components/Pricing";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Page",
  description: "This is Subscription Page",
  // other metadata
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Subscription Page"
        description="A next-gen visual logic engine that lets you design complex robot behaviors through drag-and-drop blocks — fast, intuitive, and structured for real-world deployment."
      />
      <Pricing />
    </>
  );
};

export default PricingPage;
