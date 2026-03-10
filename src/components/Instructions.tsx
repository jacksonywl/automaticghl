interface InstructionsProps {
  instructions: string | null;
}

export default function Instructions({ instructions }: InstructionsProps) {
  if (!instructions || instructions.trim() === '' || instructions.includes('(embed video here)')) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Instructions coming soon.</strong> This component is still being documented.
        </p>
        <p className="text-sm text-yellow-700 mt-2">
          General steps for GHL:
        </p>
        <ol className="list-decimal list-inside text-sm text-yellow-700 mt-1 space-y-1">
          <li>Copy the CSS code above</li>
          <li>Go to your GHL funnel/website settings</li>
          <li>Paste into Custom CSS section</li>
          <li>If a custom class is needed, add it to your element</li>
        </ol>
      </div>
    );
  }

  // Clean up the instructions
  const cleanInstructions = instructions
    .replace(/>\s*$/gm, '') // Remove trailing >
    .replace(/^\s*>\s*/gm, '') // Remove leading >
    .trim();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">How to Use</h4>
      <div className="text-sm text-blue-800 whitespace-pre-wrap">
        {cleanInstructions}
      </div>
    </div>
  );
}
