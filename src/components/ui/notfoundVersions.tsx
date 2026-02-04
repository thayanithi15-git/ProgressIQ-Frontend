import React from 'react';
import { Cpu, FileX, GitBranch, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NotFoundVersions = ({
    routerPath = '/dashboard/file-preview',
    page = 'PLC Logic',
    briefWord = 'PLC (Programmable Logic Controller) logic files'
}) => {

    const router = useRouter();

    const handleUploadFiles = () => {
        router.replace(routerPath);
    };

    return (
        <div className="bg-background">
            <div className="max-w-4xl mx-auto">

                {/* Empty State */}
                <div className="text-center flex items-center justify-center flex-col">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Main Icon */}
                            <div className="p-6 bg-muted/50 rounded-full border-2 border-dashed border-muted-foreground/30">
                                <FileX className="w-16 h-16 text-muted-foreground/60" />
                            </div>

                            {/* Overlay Icons */}
                            <div className="absolute -top-2 -right-2 p-2 bg-chart-2/10 rounded-full border border-chart-2/20">
                                <Cpu className="w-6 h-6 text-chart-2" />
                            </div>
                            <div className="absolute -bottom-2 -left-2 p-2 bg-destructive/10 rounded-full border border-destructive/20">
                                <AlertCircle className="w-5 h-5 text-destructive" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-3">
                        No {page} Versions Found
                    </h3>

                    <p className="text-muted-foreground text-lg mb-4 max-w-2xl mx-auto">
                        This machine doesn't have any {briefWord} tracked in the version control system yet.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Button
                            className="px-6 cursor-pointer py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center"
                            onClick={handleUploadFiles}
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            Upload {page} Files
                        </Button>
                    </div>

                    {/* About Section */}
                    <div className="bg-card border rounded-lg p-6 mt-8 text-left max-w-2xl mx-auto">
                        <div className="flex items-center mb-4">
                            <GitBranch className="w-5 h-5 text-primary mr-2" />
                            <h4 className="font-semibold text-foreground">About {page} Version Control</h4>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                {briefWord} contain the automation programs that control:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-chart-2 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Automated tool changing and spindle operations
                                </li>
                                <li className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-chart-2 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    Controlling versions and monitoring
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NotFoundVersions;
