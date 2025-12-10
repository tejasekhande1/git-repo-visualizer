import Button from "@/components/ui/Button";

interface ExampleCardProps {
    title: string;
    description: string;
    link?: string;
}

export default function ExampleCard({ title, description, link }: ExampleCardProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {description}
            </p>
            {link && (
                <Button size="sm" variant="default">
                    Learn More
                </Button>
            )}
        </div>
    );
}
