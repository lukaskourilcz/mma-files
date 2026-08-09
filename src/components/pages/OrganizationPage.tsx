import { AdSlot } from "@/components/ads/AdSlot";
import { FeedPageHeader } from "@/components/article/ArticleFeed";
import { WeeklyArticleFeed } from "@/components/article/WeeklyArticleFeed";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/i18n";
import { PROMOTION_ACCENT } from "@/lib/promotion";
import { getArticlesByOrganization, getLeadArticle } from "@/lib/repository";
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
  const articles = getArticlesByOrganization(organization);
  const lead = getLeadArticle();

  return (
    <>
      <AdSlot name="masthead-billboard" locale={locale} />
      <FeedPageHeader
        title={dict.organizations[organization]}
        dek={dict.organizationPage.dek}
        accent={PROMOTION_ACCENT[organization]}
      />
      <Container className="py-10 md:py-14">
        <WeeklyArticleFeed
          articles={articles}
          locale={locale}
          emptyLabel={dict.organizationPage.empty}
          anchor={lead?.publishAt}
          organization={organization}
          blockLimit={12}
        />
      </Container>
      <AdSlot name="footer-billboard" locale={locale} />
    </>
  );
}
