import { notFound } from "next/navigation";
import RecipeView from "@/components/RecipeView";
import { RECIPES, getRecipe } from "@/lib/data";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/app/recept/[slug]">) {
  const { slug } = await params;
  const r = getRecipe(slug);
  return { title: r ? `${r.name} – Juna` : "Recept – Juna" };
}

export default async function Recept({ params }: PageProps<"/app/recept/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();
  return <RecipeView recipe={recipe} />;
}
