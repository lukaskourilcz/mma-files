import { AdSlot } from "@/components/ads/AdSlot";
import { ArticleFeed, FeedPageHeader } from "@/components/article/ArticleFeed";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import { getArticlesByOrganization } from "@/lib/repository";
import type { Locale, Organization } from "@/lib/types";

/** One feed layout for UFC and Oktagon; only its sourced articles differ. */
export function OrganizationPage({
  locale,
  organization,
}: {
  locale: Locale;
  organization: Organization;
}) {
  const dict = getDictionary(locale);
  const articles = getArticlesByOrganization(organization).slice(0, 12);

  return (
    <>
      <AdSlot name="masthead-billboard" locale={locale} />
      <FeedPageHeader
        title={dict.organizations[organization]}
        dek={dict.organizationPage.dek}
        accent={PROMOTION_ACCENT[organization]}
      />
      <Container className="py-10 md:py-14">
        <ArticleFeed
          articles={articles}
          locale={locale}
          emptyLabel={dict.organizationPage.empty}
        />
      </Container>
      <AdSlot name="footer-billboard" locale={locale} />
    </>
  );
}
