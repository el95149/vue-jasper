<template>
    <div>
        <el-form ref="reportsForm" :rules="rules" :model="criteria" v-loading="loading">
            <el-col :span="12">
            <el-form-item :label="$t('jasper.report.self')" prop="report">
                <el-select v-model="criteria.report" value-key="uri"
                           :placeholder="$t('jasper.report.placeholder')" :clearable="true"
                           @change="getReportControls" @clear="clearReport">
                    <i slot="prefix" class="el-input__icon el-icon-data-analysis"></i>
                    <el-option
                            v-for="report in reports"
                            :key="report.uri"
                            :label="report.label"
                            :value="report">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-alert
                    :title="criteria.report.label"
                    :description="criteria.report.description"
                    type="info" v-if="criteria.report" show-icon :closable="false" style="margin-bottom: 10px"/>
            <template v-for="inputControl in criteria.inputControls">
                <el-form-item :label="inputControl.label"
                              :key="inputControl.uri" :prop="getPropName(inputControl)">
                    <component :name="inputControl.id" :key="inputControl.id" :is="getControlType(inputControl)"
                               v-bind="getControlProps(inputControl)"
                               v-model="inputControl.state.value" @change="inputControlValueChanged"/>
                </el-form-item>
            </template>
            </el-col>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="previewReport">
                    {{$t('jasper.report.preview')}}
                </el-button>
                <el-dropdown @command="generateReport" style="margin-right: 10px">
                    <el-button type="success" icon="el-icon-download">
                        {{$t('jasper.report.generate')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="type.value" v-for="type in types" :key="type.value">
                            {{type.label}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="secondary" icon="el-icon-data-analysis" @click="getChartableData">
                    {{$t('jasper.report.chart.prompt')}}
                </el-button>
                <el-button type="info" icon="el-icon-delete" @click="clearReport">
                    {{$t('jasper.report.clear')}}
                </el-button>
            </el-form-item>
        </el-form>

        <el-dialog :title="$t('jasper.report.preview')" :visible="isPreview" :modal="true"
                   :close-on-click-modal="false" :close-on-press-escape="true" :modal-append-to-body="false"
                   :show-close="true" width="90%" top="10px"
                   @close="clearPreview">
            <el-scrollbar :native="false">
                <div v-html="html" style="min-height: 800px;height: 900px;max-height: 1000px;"></div>
            </el-scrollbar>
        </el-dialog>

        <el-dialog :title="$t('jasper.report.chart.title')" :visible="isChartEnabled" :modal="true" @close="clearChart" top="10px" width="60%">

            <el-form ref="chartForm" :rules="rules.chart" :model="chart" v-loading="loading" :inline="true" size="mini">

                <el-form-item :label="$t('jasper.report.chart.labelProperty')" prop="labelProperty">
                    <el-select v-model="chart.labelProperty" value-key="labelProperty" :clearable="true">
                        <i slot="prefix" class="el-input__icon el-icon-data-analysis"></i>
                        <el-option
                                v-for="labelProperty in chartProperties"
                                :key="labelProperty"
                                :label="labelProperty"
                                :value="labelProperty">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('jasper.report.chart.dataProperty')" prop="dataProperty">
                    <el-select v-model="chart.dataProperty" value-key="dataProperty" :clearable="true">
                        <i slot="prefix" class="el-input__icon el-icon-data-analysis"></i>
                        <el-option
                                v-for="dataProperty in chartProperties"
                                :key="dataProperty"
                                :label="dataProperty"
                                :value="dataProperty">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('jasper.report.chart.type')" prop="type">
                    <el-select v-model="chart.type" value-key="type">
                        <i slot="prefix" class="el-input__icon el-icon-data-analysis"></i>
                        <el-option
                                v-for="chartType in chartTypes"
                                :key="chartType"
                                :label="chartType"
                                :value="chartType">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-view" @click="plotChart">
                        {{$t('jasper.report.chart.plot')}}
                    </el-button>
                </el-form-item>
            </el-form>

            <component :name="chart" :is="chart.renderableType"
                       v-if="isChartRenderable" :chart-data="chart.renderableData" :chart-options="chart.options" :styles="chart.styles"/>

        </el-dialog>
    </div>
</template>
<script src="./VueJasperVM.js"/>
